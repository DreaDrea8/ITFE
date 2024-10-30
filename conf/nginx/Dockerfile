FROM nginx
COPY ./conf/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir /etc/nginx/ssl
COPY ./conf/ssl/ /etc/nginx/ssl/
