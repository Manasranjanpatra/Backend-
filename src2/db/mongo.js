
const mongoose =require('mongoose');

let url='mongodb+srv://manasrpatra18:IyFyh16xJXaiYvGG@cluster0.ybp48j4.mongodb.net/';

mongoose.connect(url)
.then(()=>{
    console.log(`iam connected a t 4000`);

}).catch((error)=>{
    console.log(error);

});
