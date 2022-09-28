import { Injectable, Logger } from "@nestjs/common";
import { Pool } from "pg";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class DBService {
  private readonly logger = new Logger(DBService.name);
  constructor(private configService: ConfigService) {}

  private pool = new Pool(this.configService.get("pgCredentials"));

  async query(text: string, params: any[]) {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    this.logger.debug("executed query", { text, duration, rows: res.rowCount });
    return res;
  }

  async getClient() {
    const client = await this.pool.connect();
    const query = client.query;
    const release = client.release;

    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      this.logger.error("A client has been checked out for more than 5 seconds!");
      this.logger.error(`The last executed query on this client was: ${client.lastQuery}`);
    }, 5000);

    // track last query to print in case of error
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };

    client.release = () => {
      // clear our timeout
      clearTimeout(timeout);
      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  }

  async singleCommand(text: string, params: any[]) {
    const client = await this.getClient();
    try {
      await client.query("BEGIN");
      const res = await client.query(text, params);
      await client.query("COMMIT");
      return res;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
