import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Assuming we have a User model with a field for ongoing calls
interface User {
  id: string;
  ongoingCall?: Call;
}

interface Call {
  callId: string;
  callerId: string;
  receiverId: string;
  status: 'ongoing' | 'ended';
}

const users: { [key: string]: User } = {};

// Endpoint to start a new call
app.post('/api/call/start', (req, res) => {
  const { callerId, receiverId } = req.body;

  if (!callerId || !receiverId) {
    return res.status(400).send('Caller and receiver IDs are required');
  }

  const call: Call = {
    callId: Date.now().toString(),
    callerId,
    receiverId,
    status: 'ongoing',
  };

  users[callerId] = { id: callerId, ongoingCall: call };
  users[receiverId] = { id: receiverId, ongoingCall: call };

  res.status(201).send(call);
});

// Endpoint to end a call
app.post('/api/call/end', (req, res) => {
  const { callId } = req.body;

  if (!callId) {
    return res.status(400).send('Call ID is required');
  }

  for (const userId in users) {
    const user = users[userId];
    if (user.ongoingCall && user.ongoingCall.callId === callId) {
      user.ongoingCall.status = 'ended';
    }
  }

  res.status(200).send('Call ended');
});

// Endpoint to get ongoing call for a user
app.get('/api/call/ongoing/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = users[userId];

  if (!user || !user.ongoingCall) {
    return res.status(404).send('No ongoing call found for this user');
  }

  res.status(200).send(user.ongoingCall);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});