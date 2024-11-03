-- Utilisation de la base de données
use app;

-- Création de la table `user`
create table if not exists `user` (
    id int primary key auto_increment,
    login varchar(255) not null,
    password varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- Création de la table `reference`
create table if not exists `reference` (
    id int primary key auto_increment,
    signature varchar(255) not null,
    `usage` int,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp on update current_timestamp not null
);

-- Création de la table `file`
create table if not exists `file` (
    id int primary key auto_increment,
    libelle varchar(255) not null,
    description text,
    file_name varchar(255),
    original_file_name varchar(255),
    mimetype varchar(255),
    user_id int not null,
    reference_id int not null,
    size int,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    deleted_at timestamp default null,
    foreign key (user_id) references `user`(id),
    foreign key (reference_id) references `reference`(id)
);

-- Création de la table `link`
create table if not exists `link` (
    id int primary key auto_increment,
    user_id int,
    file_id int not null,
    expired_at timestamp not null,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp on update current_timestamp not null,
    foreign key (user_id) references `user`(id),
    foreign key (file_id) references `file`(id)
);

-- Insertion de données dans `user`
insert into `user` (login, password) values ('roger', 'roger');
insert into `user` (login, password) values ('jean', 'jean');
