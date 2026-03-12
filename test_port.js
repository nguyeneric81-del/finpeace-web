require('dotenv').config({ path: '.env.local' })
async function go() {
    const res = await fetch('http://localhost:3000/api/advisor/portfolio?user_id=8e1ba6ed-24a0-47df-b7d5-edc0b472af1b')
    const json = await res.json()
    console.log(JSON.stringify(json, null, 2))
}
go()
