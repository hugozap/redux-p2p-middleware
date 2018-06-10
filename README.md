# redux-p2p-middleware

This middleware makes it possible to replicate
a subset of redux actions across peers.

With this library you can select a set of actions that will
be monitored, so when a peer dispatches an action, all  other peers will receive it and dispatch it too to the local store.

To use this library you need a "Transport" that deals with the actual
replication.

**This library is BYOT (Bring your own transport) which means you need to use it with a transport implementation, or create your own(see instructions at the end of this file)**

# Install

```
yarn add redux-p2p-middleware
```

# Usage

```javascript
import replicateActions from 'redux-p2p-middleware'
import MyTransportLayer from 'some-transport-layer'

...
const transport = new MyTransportLayer()
const actionsToReplicate = ['DRAW_LINE','DRAW_RECT','DRAW_OVAL']
const replicator = replicateActions(actionsToReplicate, transport)
const store = createStore(myRootReducer, applyMiddleware(replicator))

```

# What will happen

Everytime one of the actions in the 'actionsToReplicate' array gets dispatched it will be passed to the transport layer to replicate to the other peers. When a peer receives the action it will be dispatched to the peer store.


# List of available transports

- [ ] [GunDB Transport](https://github.com/hugozap/redux-p2p-gundb-transport)
- [ ] WebRTC (TODO)
- [ ] DAT (TODO)


# Replicating the actions vs replicating the state

Some applications benefit from the replication of actions where each peer receives actions and dispatches those to its own store. Because some replication techniques do not guarantee message order, some actions could arrive in different order. This doesn't matter if you are creating a realtime social network feed but may be important in other scenarios.

# Create a custom transport layer

Transport layers need to:

- Implement the ```replicate``` method 

```javascript
 replicate(actionMsg) {
    //Send the message to the network
 }
```

- Extend from EventEmitter and emit the ```action``` event whenever a new item gets retrieved from the network.


**actionMsg** is an object with the following shape

```
{
    id: string, //uuid id of the current action (auto generated)
    action: object // the redux action e.g {type:'SOME_ACTION',...}
}
```



