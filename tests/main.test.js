import {createStore, applyMiddleware} from 'redux'
import EventEmitter from 'events'
import util from 'util'
import replicateActions from '../index';

function TestTransport() {
	var self = this;
	this.actions = [];
	this.replicate = function(actionMsg) {
		self.actions.push(actionMsg);
	}
	this.simulateReceiveAction = function(id, action) {
		self.emit('action', {
			id: id,
			action: action
		})
	}
}

util.inherits(TestTransport, EventEmitter)

describe('tests', ()=>{
	it('actions are sent to transport', ()=>{
		let reducer = (state)=>{
			return state
		}
		let transport = new TestTransport();
		let allowedActions = ['ACTION1'];
		let replicator = replicateActions(allowedActions, transport)
		let store = createStore(reducer, applyMiddleware(replicator))
		store.dispatch({
			type:'ACTION1',
			payload:'hello'
		})
		store.dispatch({
			type:'ACTION2',
			payload:'hello'
		})
		expect(transport.actions).toHaveLength(1);
		expect(transport.actions[0].action.type).toBe('ACTION1')

	})

	it('actions received from the transport are dispatched', ()=>{
		let action1called = false
		let reducer = (state, action)=>{
			switch(action.type) {
				case 'ACTION1':
					action1called = true;
					break;
			}
			return state
		}
		let transport = new TestTransport();
		let allowedActions = ['ACTION1'];
		let replicator = replicateActions(allowedActions, transport)
		let store = createStore(reducer, applyMiddleware(replicator))

		//simulate receiving the action
		//it should be dispatched locally
		transport.simulateReceiveAction('abc', {
			type: 'ACTION1',
			payload: 'hello world'
		})

		expect(action1called).toBe(true);

	})

	// it('Do not dispatch actions received not authorized', ()=>{

	// })

	// it('Do not re dispatch replicated local actions', ()=>{

	// })
})