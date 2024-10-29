// TODO 
// import { Inversify } from '@src/Inversify';
// import HelloUsecase from '@usecase/hello/Hello.usecase';
// import HelloUsecaseDto from '@usecase/hello/dto/Hello.usecase.dto';


// describe('Hello usecase', () => {
//   const mockInversify: MockProxy <Inversify> = mock<Inversify>();
//   const helloUsecase: HelloUsecase  = new HelloUsecase(mockInversify);

//   beforeEach(() => {
//     // Any necessary setup can be done here
//   });

//   afterEach(() => {
//     // Any necessary cleanup can be done here
//   });

//   describe('Hello - execute', () => {
//     it('Should greet', () => {
//       // Arrange
//       const dto: HelloUsecaseDto = {firstName: 'John', lastName:'Doe'};

//       // Act
//       const result = helloUsecase.execute(dto);

//       // Assert
//       expect(result).toBe('Hello John Doe');
//     });

//     it('Should throw an erro', () => {
//       // Arrange
//       const dto: HelloUsecaseDto = {firstName: 5, lastName:'Doe'};

//       // Act & Assert
//       expect(() => helloUsecase.execute(dto)).toThrow('Cannot divide by zero');
//     });
//   });
// });