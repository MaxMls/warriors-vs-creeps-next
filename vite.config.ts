import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
//import pages from "vite-plugin-pages";
import viteSvgIcons from "vite-plugin-svg-icons";

import * as path from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
//import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [
    //VitePWA(),
    vue({}),
    // pages({
    //   nuxtStyle: true,
    //   extensions: ["vue", "ts", "js", "tsx", "jsx"]
    // }),
    viteSvgIcons({
      iconDirs: [path.resolve(__dirname, "./src/assets/icons")],
      symbolId: "icon-[dir]-[name]"
    }),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    })
  ],
  build: {
    sourcemap: false,
    //outDir: 'docs',
    assetsInlineLimit: 0
  },
  css: {
    postcss: {
      map: true
    }
  },
  server: {
    https: {
      key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1ejoU4LlOVapO
gnlq1j3EmXxx0zDYjbSW/5mho6pESb+rf0FPT648X5TanAjTbfsMVLw+1DK8zGYs
NMqbSvXH0CB+Zo2s6tvkIjWG0kcaxvSmVGi/ud6N+uF2UCYTD/oyfOBYaOcQKsdV
0DueI7JzlMonB6LLVYGpaj7V/wjz7jf2Z+/e2g6sdaPBGbSleJBrEBaBgDp4MEIO
fqOtHGj2OOx9KBGziWj4DrMAc1vMh1h8Sas/iMYOi0sgx/qdcY06hWPGK0CINTb3
mu7aFmQ23joagtBnBEf1vvFbawFd5Bvqr/AbklqjZwwS/ktdpylc8OHyafjfOCQd
OK2yxjuxAgMBAAECggEBAKSRxa//JiwSZVGy4jZvOC5b3c0+7jHDN3wjKAe76oDo
vAbibLBmmqOnLc6c5ygMuTeyc88qESTC2vjFmuH+tSnQ5Fab22huxp94IkAz2kU/
HMblDuSmwlrQorru7cglmgdE1RF3d+piUMfSAO5kgsRrrnJ8azWnQeEHNxpKn6zL
2Bc0DUBQySBIaIfocXIDsohlve0qPtKcN2vadp/4jVzt1Rtd6bpIBT5EfqwePe76
NKr7OUUCLDtMOpZ59PaUXOkzqV9XI4sdGSFucDTY2uPsXE1Cj4ht0Q8J9XZhCal8
Yp0oGD3knQas/g+kjif1l5QwlWc/B2lBX6jZ9LWaPsECgYEA3nJbAWM+SNH78tC+
ERSz9h6COQQIRYVsFxYOYYA2kuuoln2lF6q59VEZfoaQkiAkGOwsce/WoEEHAkLY
MDbMrqTUld89WYNpk17jMIaNoZnwgQeV7SMEQKoch5YiS8q15QGcmRvhQKTBzQMw
LcnfG9mbVmVc+Q7t1clW8vyrhAkCgYEA0NneWR9Ye7ZPu4IYImKrF1zxbX/YeJl7
9fhxfQbwb3ortB3QnoiHgEWfPF+bKYTcf28aELzhgxfMQU77FUJLuSrORzXYWR15
ioHeRGNNw/4LdyLXmu8ROwm3Z+U59c1Su7In7ZS8nsSyRxeva8lgbK8plZjKjHc6
nkzPevQRdGkCgYAhU+rUo2Tijit8bs/7SSnJVzrVhggjOmE+eDyBWS9UBeDFY1/H
0vl3isYSEeE5M32VClWCYJe8fOGq8g7n8l3qUKHVLpRHhAveW5oYXCB+NM0218cb
t2Jcud/6ZIEQ7/cer4Yh3m56O/UZXT/rrFI0Hv9KC3fJjPYPUNIpJ7ge2QKBgCfn
mO5aaOOqX+2p28amJ56dKZwMc2YHnYHP6I9FBiempjcSA0xnNcyygMxeUB1Mv3yx
078i98u+fk50MtFLC4DjxuogRagxU4m9aqSSfMdYAQTQaXW2/AnVv29ggwSOKKKo
Vay1YJzNZGrlAaWMopnhlgZ5XSodldutPW92tucRAoGAWi+fdHfOZK7Q6sHuWdiE
DfFxi7d0EM5Hd3uBM1OXwK65KrOHj3KpfVlcEmM97sueZWIAuKXm2QyQpVqrkxFA
go31fCdvCGNePPODwm7MIg8IMhAFTPLvlyLSKhI9BagfyyhnnuwIFLH6JL4QI/F4
WA3suDj4BiARj2T+yh0Efdk=
-----END PRIVATE KEY-----
`,
      cert: `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIUZdfnAbJ57eL/6NNSpq96bo3LsEkwDQYJKoZIhvcNAQEL
BQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTIxMDUyNTEwMTMyN1oXDTIxMDYy
NDEwMTMyN1owFDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAtXo6FOC5TlWqToJ5atY9xJl8cdMw2I20lv+ZoaOqREm/
q39BT0+uPF+U2pwI0237DFS8PtQyvMxmLDTKm0r1x9AgfmaNrOrb5CI1htJHGsb0
plRov7nejfrhdlAmEw/6MnzgWGjnECrHVdA7niOyc5TKJweiy1WBqWo+1f8I8+43
9mfv3toOrHWjwRm0pXiQaxAWgYA6eDBCDn6jrRxo9jjsfSgRs4lo+A6zAHNbzIdY
fEmrP4jGDotLIMf6nXGNOoVjxitAiDU295ru2hZkNt46GoLQZwRH9b7xW2sBXeQb
6q/wG5Jao2cMEv5LXacpXPDh8mn43zgkHTitssY7sQIDAQABo1MwUTAdBgNVHQ4E
FgQU+lL/sgU6AJPsYAfVCBHErwqgUtIwHwYDVR0jBBgwFoAU+lL/sgU6AJPsYAfV
CBHErwqgUtIwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAVQXb
Cm+7Mx2LI2wUxki8x93xAtzuGLiT0J/D8TOZvGqBi5uEsw9ahhV0QTIuGtQ+V1kO
TKrscxHBSvq3jw8yzmf9uAYlF8M5EqEO6uJmfrLaqAdsr1P0IBFB0GTrLw9qYpFT
2Gmo5ilR5yQF8POXFSgNJIeipW/wu4hBkUX5LMUMjmep5YuHBdGy29/aOGyxSjEv
yGZF8vnNf1j9Ep0GPliIjd1MLDkxU7tcv32q68sbpj54dSQKjCOACkSCgJ0oY9/D
T2x94ecc9756y6rkEMjrUQAVPAZpiSiF25fTqMb9V9WzHTZMVDdPF/9tYUxJ+WbU
5AfJKHWclIrpxEJHTg==
-----END CERTIFICATE-----
`
    }
  }

  /*
	alias: {
		'@': path.resolve(__dirname, './src')
	},*/
});
