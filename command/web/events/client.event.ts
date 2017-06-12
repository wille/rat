enum ClientUpdateType {
	// Add client, on server connect or web panel open
	ADD = 0,

	// Update client data
	UPDATE = 1,

	// Remove client
	REMOVE = 3
}

interface ClientUpdateData {
	ping?: number;
}

interface ClientUpdateParameters {
	type: ClientUpdateType;
	// client id
	id: number;

	data: any;
}

class ClientUpdateEvent implements IncomingEvent<ClientUpdateParameters> {

	public emit(data: ClientUpdateParameters) {
		switch (data.type) {
			case ClientUpdateType.ADD:

			case ClientUpdateType.UPDATE:

			case ClientUpdateType.REMOVE:


		}
	}
}