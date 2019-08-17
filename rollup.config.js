import babel from 'rollup-plugin-babel';

const INDENT = '\t';
const BANNER = '/* github.com/shawn0326/input.js */';

export default [{
	input: 'src/main.js',
	output: {
		format: 'umd',
		name: 'input',
		file: 'build/input.js',
		indent: INDENT,
		banner: BANNER,
	},
	plugins: [
		babel({
			presets: [
				[
					'@babel/preset-env', {
						'targets': {
							'browsers': [
								'Chrome >= 52',
								'FireFox >= 44',
								'Safari >= 7',
								'Explorer 11',
								'last 4 Edge versions'
							]
						},
						'modules': false
					}
				]
			],
			exclude: 'node_modules/**'
		})
	]
},
{
	input: 'src/main.js',
	output: {
		format: 'es',
		file: 'build/input.module.js',
		indent: INDENT,
		banner: BANNER
	}
}]