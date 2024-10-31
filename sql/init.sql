-- Utilisation de la base de données
use app;

-- Création de la table `user`
create table if not exists user (
    id int primary key auto_increment,
    login varchar(255) not null,
    password varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);

-- Création de la table `file`
create table if not exists `file` (
    id int primary key auto_increment,
    title varchar(255) not null,
    description text,
    user_id int not null,
    reference varchar(255) not null,
    signature varchar(255) not null,
    size int not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references `user`(id)
);

-- Création de la table `share`
create table if not exists share (
    id int primary key auto_increment,
    user_id int,
    file_id int not null,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp on update current_timestamp not null,
    link varchar(255) not null,
    expired_at timestamp,
    foreign key (user_id) references `user`(id),
    foreign key (file_id) references `file`(id)
);


-- Insertion de données dans `user`
insert into `user` (login, password) values ('roger', 'roger');
insert into `user` (login, password) values ('jean', 'jean');

-- Insertion de données dans `file`
insert into `file` (reference, title, description, user_id) values ('file1', 'file1', 'file1', 1);
insert into `file` (reference, title, description, user_id) values ('file2', 'file2', 'file2', 2);

-- Insertion de données dans `share`
insert into share (user_id, file_id, link) values (1, 1, 'file1');
insert into share (user_id, file_id, link) values (2, 2, 'file2');


