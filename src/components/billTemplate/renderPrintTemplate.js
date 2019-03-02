import lodashmap from 'lodash.map'
import startswith from 'lodash.startswith'

const tmplnodes = [
    {
      type:'text',
      align:'CT',
      font:'B',
      size:{
        width:2,
        height:3
      },
      fieldname:'shopname',
      flag:'text',
    },
    {
      type:'text',
      align:'CT',
      font:'A',
      size:{
        width:1,
        height:1
      },
      value:'------------------订单信息------------------',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'订单来源:',
      isprintlabel:true,
      fieldname:'ordersrc',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'商户流水号:',
      isprintlabel:true,
      fieldname:'shopno',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'订单号:',
      isprintlabel:true,
      fieldname:'orderno',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'下单时间:',
      isprintlabel:true,
      fieldname:'ordertime',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'送餐时间:',
      isprintlabel:true,
      fieldname:'delivertime',
      flag:'text',
    },
    {
      type:'text',
      align:'CT',
      font:'A',
      size:{
        width:1,
        height:1
      },
      value:'------------------订单信息------------------',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'联系人:',
      isprintlabel:true,
      fieldname:'contactname',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'联系电话:',
      isprintlabel:true,
      fieldname:'contacttel',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'支付类型:',
      isprintlabel:true,
      fieldname:'paytype',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:2
      },
      label:'送餐地址:',
      isprintlabel:true,
      fieldname:'deliveraddress',
      flag:'text',
    },
    {
      type:'text',
      align:'CT',
      font:'A',
      size:{
        width:1,
        height:1
      },
      value:'------------------菜品信息------------------',
      flag:'text',
    },
    {
      type:'table',
      align:'LT',
      fieldname:'products',
      lines:[['name','count','price']],
      children:[
        {
          type:'text',
          fieldname:'name',
        },
        {
          type:'text',
          fieldname:'count',
          fixedwidth:8
        },
        {
          type:'text',
          fieldname:'price',
          fixedwidth:4
        },
      ]
    },
    {
      type:'text',
      align:'CT',
      font:'A',
      size:{
        width:1,
        height:1
      },
      value:'------------------其他------------------',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:1
      },
      label:'打包盒:',
      isprintlabel:true,
      fieldname:'packetprice',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:1
      },
      label:'总计金额:',
      isprintlabel:true,
      fieldname:'total',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:1
      },
      label:'优惠金额:',
      isprintlabel:true,
      fieldname:'discount',
      flag:'text',
    },
    {
      type:'text',
      align:'LT',
      font:'A',
      size:{
        width:1,
        height:1
      },
      label:'支付金额:',
      isprintlabel:true,
      fieldname:'payprice',
      flag:'text',
    },
]
  
const decodeList = [
    'shopname', 
    'spliteorder', 
    'ordersrc', 
    'shopno', 
    'orderno', 
    'ordertime', 
    'delivertime', 
    'spliteorder', 
    'contactname', 
    'contacttel', 
    'paytype',
    'deliveraddress',
    'spliteproduct',
    'products',
    'spliteothers',
    'packetprice',
    'total',
    'discount',
    'payprice',    
]

const createNode = (node) => {
    const templateNode = {
        type: node.type,
        align: node.align,
        font: node.font,
        size:{
            width: node.fontwidth,
            height: node.fontheight
        },
        fieldname: node.fieldname,
        flag: node.flag,
    }
    if(node.isprintlabel) {
        templateNode['isprintlabel'] = true
        templateNode['label'] = node.label
    }

    return templateNode
}

const createProductNode = (nodes) => {
    const productNode = {
        type:'table',
        align: nodes['products'].align,
        fieldname:'products',
        lines:[['name','count','price']],
        children:[]
    }

    productNode.children.push(createProductsItem(nodes, 'name'))
    productNode.children.push(createProductsItem(nodes, 'count'))
    productNode.children.push(createProductsItem(nodes, 'price'))

    return productNode
}

const createProductsItem = (nodes, id) => {
    const item = {
        type: 'text',
        fieldname: id
    }

    if(!!nodes[id].fixedwidth) {
        item['fixedwidth'] = nodes[id].fixedwidth
    }

    return item
}

const createSplite = (value) => {
    return {
        type:'text',
        align:'CT',
        font:'A',
        size:{
            width:1,
            height:1
        },
        value:`{ ------------------${value}------------------}`,
        flag:'text',
    }
}

const spliteMessage = {
    spliteorder: '订单信息',
    spliteproduct: '菜品信息',
    spliteothers: '其他'
}

const encodeNodes = (nodes) => {
    let templateNodes = []
    for (let i = 0; i < decodeList.length; i++) {
        console.log('Current Node:', decodeList[i])
        let node = {}
        if (decodeList[i] === 'products') {
            node = createProductNode(nodes)
        } else if (startswith(decodeList[i], 'splite')) {
            node = createSplite(spliteMessage[decodeList[i]])
        } else {
            node = createNode(nodes[decodeList[i]])
        }
        templateNodes.push(node)
    }

    return templateNodes
}

export default encodeNodes

