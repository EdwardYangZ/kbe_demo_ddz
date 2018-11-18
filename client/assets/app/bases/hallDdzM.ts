import { emit } from "../../funs/fn";

let app = require('../app')
var BaseM = require('../../base/BaseM')

export class HallDdzM extends BaseM {
	@emit()
	nick = ''

	@emit()
	gold = 0


}

export let hallDdzM = new HallDdzM()
