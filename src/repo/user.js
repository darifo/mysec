import User from '@/db/user';

export function addUser (data) {
    User.insert(data, function (err, newDocs) {
        console.log(err, newDocs);
    });
}

export function delUser (where = {}) {
    User.remove(where, { multi: true }, function (err, numRemoved) {
        console.log(err, numRemoved);
    });
}

export function editUser (where, newData) {
    User.update(where, newData, {}, function (err, numReplaced) {
        console.log(err, numReplaced);
    });
}

export function findUser (where, page_num = 1, page_size = 10) {
    return new Promise((resolve) => {
        User.find(where).sort({ _id: -1 }).skip((page_num - 1) * 10).limit(page_size).exec(function (err, docs) {
            resolve(docs);
        });
    });
}

export function findOneUser (where) {
    return new Promise((resolve) => {
        User.findOne(where, function (err, docs) {
            resolve(docs);
        });
    });
}
