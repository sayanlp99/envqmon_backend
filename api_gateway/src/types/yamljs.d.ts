declare module 'yamljs' {
  const yamljs: {
    load: (path: string) => any;
  };
  export = yamljs;
}
