const PORT = process.env.PORT || 8000; //this is for deploying in heroku

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express()

const researches = [
    {
        name: 'planet',
        address: 'https://wrongplanet.net/',
        base: 'https://wrongplanet.net'
    },
    {
        name: 'imaspie',
        address: 'https://imaspie.com',
        base: 'https://imaspie.com'
    },
    {
        name: 'nation',
        address: 'https://www.nationwidechildrens.org/conditions/aspergers-syndrome',
        base: 'https://www.nationwidechildrens.org'
    },
    {
        name: 'experts',
        address: 'https://www.aspergerexperts.com/about/',
        base: 'https://www.aspergerexperts.com'
    },
    {
        name: 'nih',
        address: 'https://www.ninds.nih.gov/health-information/disorders/asperger-syndrome',
        base: 'https://www.ninds.nih.gov'
    },
    {
        name: 'spectrum',
        address: 'https://www.spectrumnews.org/?s=asperger',
        base: 'https://www.spectrumnews.org'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/topics/c207p54m4wnt',
        base: 'https://www.bbc.com'

    },
    {
        name: 'webmd',
        address: 'https://www.webmd.com/brain/autism/mental-health-aspergers-syndrome',
        base: 'https://www.webmd.com'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/society/2017/sep/25/why-the-world-expert-on-aspergers-took-30-years-to-notice-condition-in-his-own-son',
        base: 'https://www.theguardian.com'
    },
    {
        name: 'medical',
        address: 'https://www.medicalnewstoday.com/articles/aspergers-symptoms-in-adults#summary',
        base: 'https://www.medicalnewstoday.com'
    },
    {
        name: 'autism',
        address: 'https://www.autism.org.uk/advice-and-guidance/what-is-autism/asperger-syndrome',
        base: 'https://www.autism.org.uk'
    }
]

const articles = []

researches.forEach(researche => {
    axios.get(researche.address).then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("autism")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title,
                url: researche.base + url,
                source: researche.name
            })
        })
    })
})
app.get('/', (req, res) => {
    res.json('Welcome to my Autism and Asperger News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:researcheId', (req, res) => {
    const researcheId = req.params.researcheId

    const researcheAddress = researches.filter(researche => researche.name == researcheId)[0].address
    const researcheBase = researches.filter(researche => researche.name == researcheId)[0].base

    axios.get(researcheAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("autism")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: researcheBase + url,
                    source: researcheId
                })
            })
            res.json(specificArticles)
        })
})

app.listen(PORT, () => console.log('Server running on PORT ${PORT}'))