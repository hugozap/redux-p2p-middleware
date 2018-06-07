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
const actionsToReplicate = ['DRAW_LINE','DRAW_RECT','DRAW_OVAL']
const replicator = replicateActions(actionsToReplicate, MyTransportLayer)
const store = createStore(myRootReducer, applyMiddleware(replicator))

```

# What will happen

Everytime one of the actions in the 'actionsToReplicate' array gets dispatched it will be passed to the transport layer to replicate to the other peers. When a peer receives the action it will be dispatched to the peer store.

# What applications can benefit of this approach?

This approach replicates the actions instead of the actual store. It makes sense for some realtime apps (but not for all). Depending on the replication strategy it's possible for some actions to arrive in different order. This won't matter for a realtime drawing app but may be problematic for other kind of apps. 



