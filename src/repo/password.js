import Password from '@/db/password';

export function addPassword (data) {
    Password.insert(data, function (err, newDocs) {
        console.log(err, newDocs);
    });
}

export function delPassword (where = {}) {
    Password.remove(where, { multi: true }, function (err, numRemoved) {
        console.log(err, numRemoved);
    });
}

export function editPassword (where, newData) {
    Password.update(where, newData, {}, function (err, numReplaced) {
        console.log(err, numReplaced);
    });
}

export function findPassword (where, page_num = 1, page_size = 10) {
    return new Promise((resolve) => {
        Password.find(where).sort({ _id: -1 }).skip((page_num - 1) * 10).limit(page_size).exec(function (err, docs) {
            resolve(docs);
        });
    });
}

export function findOnePassword (where) {
    return new Promise((resolve) => {
        Password.findOne(where, function (err, docs) {
            resolve(docs);
        });
    });
}