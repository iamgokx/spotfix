import { io, Socket } from "socket.io-client";
import { API_IP_ADDRESS } from "../ipConfig.json";

const socket = io(`http://${API_IP_ADDRESS}:8000`);

export default socket;
