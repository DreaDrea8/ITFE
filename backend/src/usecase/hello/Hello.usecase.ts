import ERRORS from '@src/common/Error';
import { Inversify } from '@inversify/Inversify';
import HelloUsecaseDto from '@usecase/hello/dto/Hello.usecase.dto';


export default class HelloUsecase {
	public helloParam = 'Hello usecase param';
  inversify: Inversify;
  
	constructor(inversify: Inversify) {
    this.inversify = inversify; 
  }

  public execute(dto:HelloUsecaseDto): string{
    try {
      if(!(typeof (dto.firstName) === 'string')){
        throw new Error(ERRORS.HELLO_USECASE_FAIL);
      }

      return `Hello ${dto.firstName} ${dto.lastName}`;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
    
  }
}