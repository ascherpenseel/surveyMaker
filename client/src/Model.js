export function Survey (id) {
    this.id = id;
    this.questions = [];
}

export function Question (text, type, likert) {
    this.text = text;
    this.type = type;
    this.likert = likert;
    this.answers = [];
}

export function Answer (type) {
    this.type = type;
    this.text = null;
    this.likert = null;
    this.email = null;
    return this;
}

Answer.prototype.setText = function (text) {
    this.text = text;
    return this;
};

Answer.prototype.setLikert = function (likert) {
    this.likert = likert;
    return this;
};

Answer.prototype.setEmail = function (email) {
    this.email = email;
    return this;
}