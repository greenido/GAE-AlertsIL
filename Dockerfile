FROM php:7.0-apache

# update and let's pick what we need as 'extra'
RUN apt-get update && \
#    apt-get install -y php7.0-mysql && \
    apt-get clean
    
# Let's have all the website code at the right location    
COPY . /var/www/html/
