import uuid from "uuid";

export default function replicateActions(allowedActions, transport) {
    const localActions = [];
    let storeRef = null;

    //Listen to actions coming from the transport
    transport.on('action', actionMsg => {

        //Only process non local actions
        if(!localActions.indexOf(actionMsg.id) >= 0) {
            if(allowedActions.indexOf(actionMsg.action.type) >= 0) {
                storeRef.dispatch(actionMsg.action);
            }
        }
    })

    return store => {
        storeRef = store;
        console.log('hola amigos')
        return next => {
            return action => {
                if (allowedActions.indexOf(action.type) >= 0) {
                    //Was action originated locally?
                    if (!action._replicated) {
                        const id = uuid.v4();
                        localActions.push(id);
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
