import cors from "cors"
import mysql from "mysql2"
import { Server } from "http"
import { Connection } from "mysql2"
import express, { Application, NextFunction, Request, Response } from "express"


import ERRORS from "./commons/Error"
import { Routes } from "./routes/Routes"
import { Repository } from "./repositories/Repository"
import loggerService from "./services/logger/LoggerService"
import { jsonContent } from "./types/jsonContent"


export default class App {
	private readonly port: number|string = process.env.PORT ?? 3000;
	private readonly host: string = process.env.HOST ?? 'localhost';
	private readonly corsOptions = {
		origin: 'localhost',
	}
	private server: Server
	public app: Application
	private readonly database: Connection = mysql.createConnection({
		host: 'mariadb',
		port: 3306,
		user: 'root',
		password: 'password',
		database: 'app',
	})
  public repository: Repository = new Repository(this.database)


	constructor() {
		this.app = express()
		this.setup()
		this.mountHealthCheck()
		this.mountAPIRoutes()
		this.mountHandleError()
		this.server = this.listen()
  }

	private async setup() {
		this.app.use(cors(this.corsOptions))
		this.app.use(express.json())
	}

	private mountHealthCheck() {
		this.app.get("/api/health", (req: Request, res: Response) => {
			const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: 'Healthy!!', 
        error: null
      }

			loggerService.success('Api health')
			res.status(200).json(result)
		})
	}

	private mountAPIRoutes() {
		const routes = new Routes(this.repository)
		this.app.use("/api", routes.router)
	}

	private mountHandleError() {
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			loggerService.error(ERRORS.ROUTE_NOT_FOUND);
			res.status(404).json({
				'message': 'You are lost.',
				'data': '',
				'error': ERRORS.ROUTE_NOT_FOUND
			})
		})
	}
  
	private listen() {
		this.server = this.app.listen(this.port, () => {
			console.log(
				`App listening on port: http://${this.host}:${this.port} in ${process.env.NODE_ENV} mode`
			)
			console.log('Press CTRL-C to stop\n')
		});

		return this.server
	}

}



