import { getRepository, Repository } from "typeorm";
import { AuthUserService } from "../authentication/repositories";
import { Grammer } from "./models";

export class GrammerService {
  private readonly grammerRepository: Repository<Grammer>;
  private readonly authUserService: AuthUserService;

  constructor() {
    this.grammerRepository = getRepository(Grammer);
    this.authUserService = new AuthUserService();
  }

  public async createGrammer(
    username: string,
    password: string
  ): Promise<Grammer> {
    const authUser = await this.authUserService.register(username, password);
    const grammer = new Grammer();
    grammer.visible_name = username;
    grammer.auth_user = authUser;
    grammer.profile_picture = "asdasd"  // TODO: grammer profile picture generation algorithm

    await this.grammerRepository.save(grammer);

    return grammer;
  }

  public async getByUsernameAndPassword(username: string, password: string): Promise<Grammer> {
    const authUser = await this.authUserService.getUserByUsernameAndPassword(username, password);
    return await this.grammerRepository.findOne({ auth_user: authUser });
  }
}
