import bcrypt from "bcrypt";
import { getRepository, Repository } from "typeorm";
import { AuthUser } from "./models";

export class AuthUserService {
  private authUserRepository: Repository<AuthUser>;

  constructor() {
    this.authUserRepository = getRepository(AuthUser);
  }

  public async register(username: string, password: string): Promise<AuthUser> {
    const authUser = new AuthUser();
    authUser.username = username;
    authUser.password = await this.hashPassword(password);

    await this.authUserRepository.save(authUser);

    return authUser;
  }

  public async getUserByUsernameAndPassword(username: string, password: string): Promise<AuthUser> {
    const authUser = await this.authUserRepository.findOne({ username });
    if (! await bcrypt.compare(password, authUser.password)) {
      throw new Error("invalid username or password");
    }

    return authUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
