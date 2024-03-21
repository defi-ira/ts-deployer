import { Server } from "@ganache/cli";
import { Account } from "./Account";

export default class Chain {
    server: Server;
    port: number;
    localAddress: string;
    memoryUsage: MemoryUsage[];

    constructor(server: Server, port: number, localAddress: string, memoryUsage: MemoryUsage[]) {
        this.server = server;
        this.port = port;
        this.localAddress = localAddress;
        this.memoryUsage = memoryUsage;
    }
}

class MemoryUsage {
    // Define properties for the memory usage object here
}