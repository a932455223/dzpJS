fis.match('*.less', {
  parser: fis.plugin('less-2.x'),
  rExt: '.css'
})

fis.match('*.less',{
        postprocessor: fis.plugin('less-autoprefix',{browsers:["last 4 versions"]})
})