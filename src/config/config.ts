interface IAppConfig {
  backendBaseUrl: string;
}

const devConfig: IAppConfig = {
  backendBaseUrl: 'http://localhost:5000',
};

const prodConfig: IAppConfig = {
  backendBaseUrl: 'https://meetmethere-app-be-2k4cznjtna-lz.a.run.app',
};

const getConfig = (): IAppConfig =>
  import.meta.env.MODE === 'production' ? prodConfig : devConfig;

export default getConfig;
