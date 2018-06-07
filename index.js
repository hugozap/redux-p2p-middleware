import uuid from "uuid";

export default function replicateActions(allowedActions, transport) {
    const locallyDispatched = [];
    let storeRef = null;

    //Listen to actions coming from the transport
    transport.on('action', actionMsg => {

        //Only process non local actions
        if(!locallyDispatched.indexOf(actionMsg.id) >= 0) {
            if(allowedActions.indexOf(actionMsg.action.type) >= 0) {
                //Store the replication id so we can check
                //in the middleware and don't replicate it again
                actionMsg.action.__replicationId = actionMsg.id
                storeRef.dispatch(actionMsg.action);
            }
        }
    })

    return store => {
        storeRef = store;
        return next => {
            return action => {
                if (allowedActions.indexOf(action.type) >= 0) {
                    //Was action originated locally?
                    if (action.__replicationId) {
                        //replicated action
                        locallyDispatched.push(action.__replicationId);

                    } else {
                        //locally dispatched, generate new replication id
                        const id = uuid.v4();
                        locallyDispatched.push(id);
                        //send to transport layer
                        transport.replicate({
                            id: id,
                            action: action
                        });
                    }
                }
                next(action);
            };
        };
    };
}

