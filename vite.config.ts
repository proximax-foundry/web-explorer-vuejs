import { fileURLToPath, URL } from "node:url";
import { defineConfig , loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { nodePolyfills } from "vite-plugin-node-polyfills";


// https://vitejs.dev/config/
export default defineConfig(({command,mode})=>{
  const env = loadEnv(mode, process.cwd(), '')
  let publicPath = '/';

  switch(env.NODE_ENV){
      case 'staging':
          publicPath = '/web-explorer-vuejs'
          break;
      case 'production':
          publicPath = ''
          break;
      case 'development':
          publicPath = '/'
          break;
  }
  return{
    define: {
      BUILD_YEAR :new Date().getFullYear()
    },
    base:  publicPath,
    plugins: [
      vue(),
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  }
  
  
});
