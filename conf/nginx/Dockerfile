FROM nginx

RUN apt-get update && \
    apt-get install -y pandoc

COPY ./conf/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir /etc/nginx/ssl
COPY ./conf/ssl/ /etc/nginx/ssl/

# Copier les fichiers Markdown et les convertir en HTML
COPY ./openapi.yml /usr/share/nginx/html/openapi.yml
COPY ./conf/nginx/public/docApi.html /usr/share/nginx/html/docApi.html
COPY ./README.md /usr/share/nginx/html/README.md
COPY ./error-nginx.png /error-nginx.png
COPY ./news.md /usr/share/nginx/html/news.md

# Convertir README.md en readme.html et news.md en news.html avec les options Pandoc
RUN pandoc /usr/share/nginx/html/README.md -o /usr/share/nginx/html/readme.html \
    --from markdown --to html5 --standalone --toc --highlight-style=zenburn
RUN pandoc /usr/share/nginx/html/news.md -o /usr/share/nginx/html/news.html \
    --from markdown --to html5 --standalone --toc --highlight-style=zenburn

# Supprimer les fichiers temporaires
# RUN rm /tmp/README.md /tmp/news.md