fis.match('**.less', {
  parser: fis.plugin('less-2.x'),
  rExt: '.css'
})

fis.match('**.less',{
        postprocessor: fis.plugin('less-autoprefix',{browsers:["last 4 versions"]})
})

fis.match('**.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('**.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('**.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

fis.match('**.html', {
  optimizer: fis.plugin('html-minifier')
})

fis.media('prod').match('**.{js,less,png,css,jpg,gif}',{
	useHash:true,
	url:'/public/dzpJs$0'
})
