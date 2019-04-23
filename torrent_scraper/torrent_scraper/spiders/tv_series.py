# -*- coding: utf-8 -*-
import scrapy


class TvSeriesSpider(scrapy.Spider):
    name = 'tv_series'
    start_urls = []
    base_url = "https://kat.am/tv/"

    for page in range(1, 201):
        page_url = base_url + str(page) + "/" 
        start_urls.append(page_url)

    def parse(self, response):

        titles = response.css(".cellMainLink::text").extract()
        file_sizes = response.css(".nobr.center::text").extract()
        seeders = response.css(".green.center::text").extract()
        leechers = response.css(".red.lasttd.center::text").extract()
        
        file_sizes = file_sizes[2:]

        for item in zip(titles,file_sizes,seeders,leechers):
            scraped_info = {
                'title' : item[0],
                'file_size' : item[1],
                'seeders_count' : item[2],
                'leechers_count' : item[3],
            }
           
            yield scraped_info

    