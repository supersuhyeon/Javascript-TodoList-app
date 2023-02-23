import scss from 'rollup-plugin-scss'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import {nodeResolve} from '@rollup/plugin-node-resolve'

export default {
    input: 'src/js/index.js', // 어떤 파일로 부터 불러올것인지 설정
    output: {
        file: './dist/bundle.js',
        format : 'cjs', //commonjs 형태로 번들링
        sourcemap: false
    },
    plugins:[ //rollup 에 확장할 기능은 플러그인으로 추가할 수 있습니다
        nodeResolve(), //외부 노드 모듈을 사용시 (node_modules 디렉토리)
        scss({
            insert:true,
            sourceMap:false
        }),
        htmlTemplate({ //index.html에 번들 스크립트 추가하여 생성
            template : 'src/index.html',
            target:'index.html'
        })
    ]
}