import { Server } from 'http';
import express, { Application, Request, Response } from 'express';


export default class App {
	private readonly port: number|string = process.env.PORT ?? 3000;
	private readonly host: string = process.env.HOST ?? 'localhost';

	const loggerService: logg
	

	public app: Application;
	private server: Server;
  


	private mountHealthCheck() {
		this.app.get("/health", (req: Request, res: Response) => {
			const response:{message: string} = { message: 'Healthy!!' };
			this.loggerService.success('Api health');
			res.status(200).json(response);
		});
	}
  
	private listen() {
		this.server = this.app.listen(this.port, () => {
			console.log(
				`App listening on port: http://${this.host}:${this.port} in ${process.env.NODE_ENV} mode`
			);
			console.log('Press CTRL-C to stop\n');
		});

		return this.server;
	}

}

