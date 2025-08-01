class apiFeatures{
    constructor(query,queryString){
        this.query=query; // query string
        this.queryStr = queryString; // req.body

        //delete this.query
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this
    }

    filter(){
        let queryString = JSON.stringify(this.queryStr);// /\b(gte|gt|lte|lt)\b/g
        queryString = queryString.replace(/\b(lte|gte|gt|lt)\b/g,(mtch)=> `$${mtch}`);
        const queryObj = JSON.parse(queryString);
        delete queryObj.sort
        delete queryObj.fields
        delete queryObj.page
        delete queryObj.limit;

        const excludedFields = ['page', 'sort', 'limit', 'fields'];  // Exclude fields not used for filtering
        excludedFields.forEach(el => delete queryObj[el]);

        this.query = this.query.find(queryObj);
        return this
    } 

    paginate(){
        const page = this.queryStr.page*1 || 1;
        const limit = this.queryStr.limit*1 || 10;
        const skip = (page-1) *limit;

        this.query = this.query.skip(skip).limit(limit)
        return this
    }

    limitFields(){
       if(this.queryStr.fields){
            const fieldsSort = this.queryStr.fields.split(',').join(' ')
            this.query = this.query.select(fieldsSort);
        }else{
            this.query = this.query.select('-__v');
        }   
        return this
    }
   
}

module.exports = apiFeatures