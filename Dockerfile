FROM php:7.0-apache

# update and let's pick what we need as 'extra'
RUN apt-get update && \
#    apt-get install -y php7.0-mysql && \
    apt-get clean
 
# If we wish to change the path to doc-root 
#ENV APACHE_DOCUMENT_ROOT /path/to/new/root

# and have other conf
#RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
#RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Let's have all the website code at the right location    
COPY . /var/www/html/
