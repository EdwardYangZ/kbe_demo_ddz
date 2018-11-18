
var KBEngine = require("kbengine")

// KBEngine.Vector3 = cc.Vertex3F
/**
 * 重写 KBEngine 原生 Entity
 * * 去除冗余特性
 * * 自定义拓展
 * @class KBEngine.Entity
 */
/*-----------------------------------------------------------------------------------------
												entity，重写原entity
-----------------------------------------------------------------------------------------*/
KBEngine.Entity = cc.Class({
	extends: require('BaseM'),
		
	ctor:function () {
		this.id = 0;
		this.className = "";
		// this.position = new KBEngine.Vector3(0.0, 0.0, 0.0);
		// this.direction = new KBEngine.Vector3(0.0, 0.0, 0.0);
		// this.velocity = 0.0
			
		this.cell = null;
		this.base = null;
		
		// enterworld之后设置为true
		this.inWorld = false;
		
		// __init__调用之后设置为true
		this.inited = false;
		
		// 是否被控制
		this.isControlled = false;

		this.entityLastLocalPos = new KBEngine.Vector3(0.0, 0.0, 0.0);
		this.entityLastLocalDir = new KBEngine.Vector3(0.0, 0.0, 0.0);
		
		return true;
	},
	
	// 与服务端实体脚本中__init__类似, 代表初始化实体
	__init__ : function()
	{
	},

	/* CHANGE : 获得所以属性定义 */
	allProps: function () {
		var currModule = KBEngine.moduledefs[this.className];
		return currModule.propertys
	},

	callPropertysSetMethods : function()
	{
		var currModule = KBEngine.moduledefs[this.className];
		for(var name in currModule.propertys)
		{
			var propertydata = currModule.propertys[name];
			var properUtype = propertydata[0];
			var name = propertydata[2];
			var setmethod = propertydata[5];
			var flags = propertydata[6];
			var oldval = this[name];
			
			if(setmethod != null)
			{
				// base类属性或者进入世界后cell类属性会触发set_*方法
				// ED_FLAG_BASE_AND_CLIENT、ED_FLAG_BASE
				if(flags == 0x00000020 || flags == 0x00000040)
				{
					if(this.inited && !this.inWorld)
						setmethod.call(this, oldval);
				}
				else
				{
					if(this.inWorld)
					{
						if(flags == 0x00000008 || flags == 0x00000010)
						{
							if(!this.isPlayer())
								continue;
						}
						
						setmethod.call(this, oldval);
					}
				}
			}
		};
	},

	onDestroy : function()
	{
	},

	onControlled : function(bIsControlled)
	{
	},

	isPlayer : function()
	{
		return this.id == KBEngine.app.entity_id;
	},

	baseCall : function()
	{
		if(arguments.length < 1)
		{
			KBEngine.ERROR_MSG('KBEngine.Entity::baseCall: not fount interfaceName!');  
			return;
		}

		if(this.base == undefined)
		{
			KBEngine.ERROR_MSG('KBEngine.Entity::baseCall: base is None!');  
			return;			
		}
		
		var method = KBEngine.moduledefs[this.className].base_methods[arguments[0]];

		if(method == undefined)
		{
			KBEngine.ERROR_MSG("KBEngine.Entity::baseCall: The server did not find the def_method(" + this.className + "." + arguments[0] + ")!");
			return;
		}
		
		var methodID = method[0];
		var args = method[3];
		
		if(arguments.length - 1 != args.length)
		{
			KBEngine.ERROR_MSG("KBEngine.Entity::baseCall: args(" + (arguments.length - 1) + "!= " + args.length + ") size is error!");  
			return;
		}
		
		this.base.newMail();
		this.base.bundle.writeUint16(methodID);
		
		try
		{
			for(var i=0; i<args.length; i++)
			{
				if(args[i].isSameType(arguments[i + 1]))
				{
					args[i].addToStream(this.base.bundle, arguments[i + 1]);
				}
				else
				{
					throw new Error("KBEngine.Entity::baseCall: arg[" + i + "] is error!");
				}
			}
		}
		catch(e)
		{
			KBEngine.ERROR_MSG(e.toString());
			KBEngine.ERROR_MSG('KBEngine.Entity::baseCall: args is error!');
			this.base.bundle = null;
			return;
		}
		
		this.base.postMail();
	},
	
	cellCall : function()
	{
		if(arguments.length < 1)
		{
			KBEngine.ERROR_MSG('KBEngine.Entity::cellCall: not fount interfaceName!');  
			return;
		}
		
		if(this.cell == undefined)
		{
			KBEngine.ERROR_MSG('KBEngine.Entity::cellCall: cell is None!');  
			return;			
		}
		
		var method = KBEngine.moduledefs[this.className].cell_methods[arguments[0]];
		
		if(method == undefined)
		{
			KBEngine.ERROR_MSG("KBEngine.Entity::cellCall: The server did not find the def_method(" + this.className + "." + arguments[0] + ")!");
			return;
		}
		
		var methodID = method[0];
		var args = method[3];
		
		if(arguments.length - 1 != args.length)
		{
			KBEngine.ERROR_MSG("KBEngine.Entity::cellCall: args(" + (arguments.length - 1) + "!= " + args.length + ") size is error!");  
			return;
		}
		
		this.cell.newMail();
		this.cell.bundle.writeUint16(methodID);
		
		try
		{
			for(var i=0; i<args.length; i++)
			{
				if(args[i].isSameType(arguments[i + 1]))
				{
					args[i].addToStream(this.cell.bundle, arguments[i + 1]);
				}
				else
				{
					throw new Error("KBEngine.Entity::cellCall: arg[" + i + "] is error!");
				}
			}
		}
		catch(e)
		{
			KBEngine.ERROR_MSG(e.toString());
			KBEngine.ERROR_MSG('KBEngine.Entity::cellCall: args is error!');
			this.cell.bundle = null;
			return;
		}
		
		this.cell.postMail();
	},
	
	enterWorld : function()
	{
		KBEngine.INFO_MSG(this.className + '::enterWorld: ' + this.id); 
		this.inWorld = true;
		this.onEnterWorld();
		
		KBEngine.Event.fire("onEnterWorld", this);
	},

	onEnterWorld : function()
	{
	},
		
	leaveWorld : function()
	{
		KBEngine.INFO_MSG(this.className + '::leaveWorld: ' + this.id); 
		this.inWorld = false;
		this.onLeaveWorld();
		KBEngine.Event.fire("onLeaveWorld", this);
	},

	onLeaveWorld : function()
	{
	},
		
	enterSpace : function()
	{
		KBEngine.INFO_MSG(this.className + '::enterSpace: ' + this.id); 
		this.onEnterSpace();
		KBEngine.Event.fire("onEnterSpace", this);
		
		// 要立即刷新表现层对象的位置
		// KBEngine.Event.fire("set_position", this);
		// KBEngine.Event.fire("set_direction", this);
	},

	onEnterSpace : function()
	{
	},
		
	leaveSpace : function()
	{
		KBEngine.INFO_MSG(this.className + '::leaveSpace: ' + this.id); 
		this.onLeaveSpace();
		KBEngine.Event.fire("onLeaveSpace", this);
	},

	onLeaveSpace : function()
	{
	},
		
	set_position : function(old)
	{
		KBEngine.DEBUG_MSG(this.className + "::set_position: " + old);  
		
		if(this.isPlayer())
		{
			KBEngine.app.entityServerPos.x = this.position.x;
			KBEngine.app.entityServerPos.y = this.position.y;
			KBEngine.app.entityServerPos.z = this.position.z;
		}
		
		KBEngine.Event.fire("set_position", this);
	},

	onUpdateVolatileData : function()
	{
	},
	
	set_direction : function(old)
	{
		KBEngine.DEBUG_MSG(this.className + "::set_direction: " + old);  
		KBEngine.Event.fire("set_direction", this);
	}
});


module.exports = KBEngine.Entity