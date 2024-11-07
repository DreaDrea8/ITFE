import cors from "cors"
import mysql from "mysql2"
import { Server } from "http"
import { Connection } from "mysql2"
import express, { Application, NextFunction, Request, Response } from "express"

import ERRORS from "./commons/Error"
import bodyParser from "body-parser"
import { Routes } from "./routes/Routes"
import { Service } from "./services/service"
import { jsonContent } from "./types/jsonContent"
import { Repository } from "./repositories/Repository"
import { API_HOST, API_PORT, DB_DATABASE, DB_HOST, DB_PASSORD, DB_PORT, DB_USER } from "./commons/config"

export default class App {
	private readonly port: number|string = API_PORT
	private readonly host: string = API_HOST
	private readonly corsOptions = {
		origin: '*'
	}
	private server: Server
	public app: Application
	private readonly database: Connection = mysql.createConnection({
		host: DB_HOST,
		port: DB_PORT,
		user: DB_USER,
		password: DB_PASSORD,
		database: DB_DATABASE
	})
  public service: Service = new Service()
  public repository: Repository = new Repository(this.database, this.service)


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
    this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded())
  }

	private mountHealthCheck() {
		this.app.get("/api/health", (req: Request, res: Response) => {
			this.service.loggerService.success('Api health')
			const result:jsonContent = {
        message: 'Infos retrieved successfully',
        data: 'Healthy !!', 
        error: null
      }
			res.status(200).json(result)
		})
	}

	private mountAPIRoutes() {
		const routes = new Routes(this.repository, this.service)
		this.app.use("/api", routes.router)
	}

	private mountHandleError() {
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			this.service.loggerService.error(ERRORS.ROUTE_NOT_FOUND)
      const result: jsonContent = {
        message: "Resource not found",
        data: null,
        error: this.service.formatError( null, ERRORS.ROUTE_NOT_FOUND)
      }
      res.status(404).json(result)
		})
	}
  
	private listen() {
		this.server = this.app.listen(this.port, () => {
			console.log(
				`App listening on port: https://${this.host}:${this.port} in ${process.env.NODE_ENV} mode`
			)
			console.log('Press CTRL-C to stop\n')
		})

		return this.server
	}

}
