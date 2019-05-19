package main

var (
	// Clients are all connected clients to this server
	Clients []*Client
)

func add(client *Client) {
	Clients = append(Clients, client)

	broadcast(NewClientEvent(Add, client, client.GetClientData()))
}

func removeClient(client *Client) {
	for k, v := range Clients {
		if v.Id == client.Id {
			Clients = append(Clients[:k], Clients[k+1:]...)
			break
		}
	}

	broadcast(NewClientEvent(Remove, client, nil))
}

// Send new information from all connected clients
func updateAll() {
	for _, client := range Clients {
		broadcast(NewClientEvent(Add, client, client.GetClientData()))
	}
}

// Get a client from ID
func get(id int) *Client {
	for _, v := range Clients {

		if v.Id == id {
			return v
		}
	}

	return nil
}
