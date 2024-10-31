import { Router, Request, Response } from "express";
import { RegisterController } from "../controllers/register/RegisterController";
import { Repository } from "../repositories/Repository";
import { UserRoute } from "./userRoute";

export class Routes {
  router: Router = Router();
  userRoute: UserRoute;

  constructor(repository: Repository) {
    this.userRoute = new UserRoute(repository);
    console.log("api");

    this.router.use("/user", this.userRoute.router);
  }
  private initializeRoutes() {
    this.router.post("/register", async (req: Request, res: Response) => {
      try {
        //await this.registerController.register(req, res);
      } catch (error) {
        res.status(500).json({ message: "An unexpected error occurred." });
      }
    });
  }
}
