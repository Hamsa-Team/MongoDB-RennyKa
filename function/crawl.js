module.exports = async function crawlData(ctx) {
    let data = fs.readFileSync('employees.json', 'utf8')
    const result = await ctx.db.collection('employees').insertMany(JSON.parse(data));
    return result ? true : false;
}