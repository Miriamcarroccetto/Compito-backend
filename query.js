{ isActive: true}
//51 query trovate

{ age: {$gt : 26} }
//54 query trovate

{ age: { $gt: 26 ; $lte: 30}}
//19 query trovate

{ eyeColor: { $in: [ 'brown', 'blue']}}
//66 query trovate

{ eyeColor: { $ne: 'green'}}
//66 query trovate

{ eyeColor: { $nin: ['green', 'blue']}}
//35 query trovate

{ company: 'FITCORE'}
project: {email: 1;_id: 0}
//1 query
//email: "victoria.solis@fitcore.biz"


