import App from '@src/App';
import inversify from '@inversify/Inversify';


const bootstrap = () => {
  inversify.loggerService.info('start');
  new App(inversify); 
};

bootstrap();