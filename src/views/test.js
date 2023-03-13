function isIgnores(str){
    for(let ignore of ignores){
      if(str.includes(ignore)){
        return true
      }
    }
    return false
  }

  let ignores=['发票类别','资料区间','份数','购方企业名称']
  let str="数：166  金额：11638228.75元  税额：1435253.33元"
    console.log(isIgnores(str))
    console.log("*光电测量仪器*微波信号源40G".split("*").slice(-1))