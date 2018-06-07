# redux-action-replicator-middleware

This middleware makes it possible to replicate
a subset of redux actions across peers.

With this library you can select a set of actions that will
be monitored, so when a peer dispatches an action, all  other peers will receive it and dispatch it too to the local store.

To use this library you need a "Transport" that deals with the actual
replication.

(See GunDbTransport for an example)


# Usage

```javascript
import replicateActions from 'redux-action-replicator-middleware'
import MyTransportLayer from 'some-transport-layer'

...
const transport = new MyTransportLayer()
const actionsToReplicate = ['DRAW_LINE','DRAW_RECT','DRAW_OVAL']
const replicator = replicateActions(actionsToReplicate, transport)
const store = createStore(myRootReducer, applyMiddleware(replicator))

```

# What will happen

Everytime one of the actions in the 'actionsToReplicate' array gets dispatched it will be passed to the transport layer to replicate to the other peers. When a peer receives the action it will be dispatched to the peer store.

# What applications can benefit of this approach?

This approach replicates the actions instead of the actual store. It makes sense for some realtime apps (but not for all). Depending on the replication strategy it's possible for some actions to arrive in different order. This won't matter for a realtime drawing app but may be problematic for other kind of apps. 

# Create a custom transport layer

Transport layers need to:

- Extend from EventEmitter and emit the event
- Implement the ```replicate``` method 
```
 replicate(actionMsg) {
    //Send the message to the network
 }
```

actionMsg is created by the middleware and has the following shape

```
{
    id: string //uuid id of the current action
    action: object // the redux action e.g {type:'SOME_ACTION',...}
}
```

The transport layer should serialize and send the message to the network.

- Emit the 'action' event when a new item arrives from the network. The event parameter should be the actionMsg with the same structure described previously.






