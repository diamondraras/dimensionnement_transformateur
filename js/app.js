new Vue({
    el: "#app",
    data: {
        couplage_primaire: "",
        couplage_secondaire: "",
        puisance_apparente: "",
        nombre_phases: "",
        f: 50,
        B: 1,
        u1: "",
        u2: "",
        a_prime: "",
        rendements: [{
                eta: 76,
                sn: 25
            },
            {
                eta: 84,
                sn: 50
            },
            {
                eta: 85,
                sn: 100
            },
            {
                eta: 86,
                sn: 200
            },
            {
                eta: 88,
                sn: 300
            },
            {
                eta: 90,
                sn: 400
            },
            {
                eta: 90.5,
                sn: 500
            },
            {
                eta: 91.5,
                sn: 750
            },
            {
                eta: 90.9,
                sn: 1000
            }
        ],
        chute_tensions: [{
                deltaU2: 15,
                sn: 25
            },
            {
                deltaU2: 12,
                sn: 50
            },
            {
                deltaU2: 9,
                sn: 100
            },
            {
                deltaU2: 7.5,
                sn: 200
            },
            {
                deltaU2: 6.5,
                sn: 400
            },
            {
                deltaU2: 6,
                sn: 500
            },
            {
                deltaU2: 6,
                sn: 500
            },
            {
                deltaU2: 5.5,
                sn: 750
            },
            {
                deltaU2: 5,
                sn: 1000
            }
        ],
        section_conducteurs: [{
                sn: 50,
                j: 4
            },
            {
                sn: 100,
                j: 3.5
            },
            {
                sn: 200,
                j: 3
            },
            {
                sn: 500,
                j: 2.5
            },
            {
                sn: 750,
                j: 2.5
            },
            {
                sn: 1000,
                j: 2.5
            }
        ]
    },
    computed: {
        i1: function () {
            let current_eta = this.rendements.filter(
                e => e.sn == this.puisance_apparente
            )[0];
            if (this.nombre_phases == 1) {
                if (this.puisance_apparente && this.u1)
                    return this.puisance_apparente / (current_eta.eta * this.u1);
            } else if (this.nombre_phases == 3) {
                if (this.puisance_apparente && this.u1)
                    return (
                        this.puisance_apparente / (Math.sqrt(3) * current_eta.eta * this.u1)
                    );
            }
            return 0;
        },
        u20: function () {
            if (this.u2 && this.puisance_apparente) {
                let current_chute_tension = this.chute_tensions.filter(
                    e => e.sn == this.puisance_apparente
                )[0];
                return this.u2 + current_chute_tension.deltaU2;
            }
            return 0;
        },
        i2: function () {
            if (this.nombre_phases == 1 && this.u20)
                return this.puisance_apparente / this.u20;
            else if (this.nombre_phases == 3 && this.u20)
                return this.puisance_apparente / (Math.sqrt(3) * this.u20);
            return 0;
        },
        s1: function () {
            this.nombre_phases;
            this.puisance_apparente;
            if (this.puisance_apparente && this.i1) {
                let tempPuissance = JSON.parse(JSON.stringify(this.puisance_apparente));
                if (this.puisance_apparente == 25) tempPuissance = 50;
                else if (this.puisance_apparente == 400) tempPuissance = 500;

                let c = this.section_conducteurs.filter(e => e.sn == tempPuissance)[0];

                return this.i1 / c.j;
            }
            return 0;
        },
        s2: function () {
            this.nombre_phases;
            this.puisance_apparente;
            if (this.puisance_apparente && this.i1) {
                let tempPuissance = JSON.parse(JSON.stringify(this.puisance_apparente));
                if (this.puisance_apparente == 25) tempPuissance = 50;
                else if (this.puisance_apparente == 400) tempPuissance = 500;

                let c = this.section_conducteurs.filter(e => e.sn == tempPuissance)[0];

                return this.i2 / c.j;
            }
            return 0;
        },
        d1: function () {
            if (this.s1) {
                return Math.sqrt((4 * this.s1) / Math.PI);
            }
            return 0;
        },
        d2: function () {
            if (this.s2) {
                return Math.sqrt((4 * this.s2) / Math.PI);
            }
            return 0;
        },
        s: function () {
            if (this.nombre_phases == 3) {
                return 8 * Math.sqrt(this.puisance_apparente / (3 * this.f));
            }
            return 0;
        },
        sa: function () {
            if (this.nombre_phases == 1) {
                return 1.32 * Math.sqrt(this.puisance_apparente);
            }
            return 0;
        },
        sr: function () {
            if (this.nombre_phases == 1) {
                return 1.2 * Math.sqrt(this.puisance_apparente);
            }

            return 0;
        },
        n1: function () {
            if (this.nombre_phases == 1 && this.puisance_apparente) {
                return this.u1 * 10000 / (4.44 * this.f * this.B * this.sa);
            }
            return 0;
        },
        n2: function () {
            if (this.nombre_phases == 1 && this.puisance_apparente) {
                return this.u20 * 10000 / (4.44 * this.f * this.B * this.sa);
            }
            return 0;
        },
        l: function () {
            if (this.nombre_phases == 1) {
                return Math.sqrt(this.sa);
            }
            return 0;
        },
        L: function () {
            if (this.nombre_phases == 1) {
                return 3 * this.l;
            }
            return 0;
        },
        a: function () {
            if (this.nombre_phases == 1 && this.sa && this.l) {
                return this.sa / this.l;
            }
            return 0;
        },
        Nbt: function () {
            if (this.nombre_phases == 1 && this.a_prime) {
                return this.a / this.a_prime;
            }
            return 0;
        },
        ip1: function () {
            if (this.couplage_primaire) {
                switch (this.couplage_primaire) {
                    case "triangle":
                        return this.i1 / Math.sqrt(3);
                    case "etoile":
                        return this.i1;
                }
            }
            return 0;
        },
        ip2: function () {
            if (this.couplage_secondaire) {
                switch (this.couplage_secondaire) {
                    case "triangle":
                        return this.i2 / Math.sqrt(3);
                    case "etoile":
                    case "zigzag":
                        return this.i2;
                }
            }
            return 0;
        },
        il1: function () {
            if (this.puisance_apparente && this.u1) {
                return this.puisance_apparente / (this.u1 * Math.sqrt(3));
            }
            return 0;
        },
        il2: function () {
            if (this.puisance_apparente && this.u2) {
                return this.puisance_apparente / (this.u2 * Math.sqrt(3));
            }
            return 0;
        },
        up1: function () {
            if (this.puisance_apparente && this.u1) {
                switch (this.couplage_primaire) {
                    case 'triangle':
                        console.log(this.u1);

                        return parseFloat(this.u1)
                    case 'etoile':
                        return this.u1 / Math.sqrt(3)
                    default:
                        return 0
                }
            }
            return 0;
        },
        up2: function () {
            if (this.puisance_apparente && this.u2) {

                switch (this.couplage_secondaire) {
                    case 'triangle':
                        return parseFloat(this.u2)
                    case 'etoile':
                    case 'zigzag':
                        return this.u2 / Math.sqrt(3)
                    default:
                        return 0
                }
            }
            return 0;
        },
        s: function () {
            if (this.puisance_apparente) {
                return 8 * Math.sqrt(this.puisance_apparente / (3 * this.f));
            }
            return 0;
        },
        nBT: function () {
            let ubt;
            let uht;
            if (this.u1 && this.u2 && this.couplage_primaire && this.couplage_secondaire) {
                if (this.u1 < this.u2) {
                    ubt = this.up1;
                    uht = this.up2;
                } else {
                    ubt = this.up2;
                    uht = this.up1;
                }
                return ubt * 10000 / (4.44 * this.f * this.B * this.s);
            }
            return 0;
        },
        nHT: function () {
            let ubt;
            let uht;
            if (this.u1 && this.u2 && this.couplage_primaire && this.couplage_secondaire) {
                if (this.u1 < this.u2) {
                    ubt = this.up1;
                    uht = this.up2;
                } else {
                    ubt = this.up2;
                    uht = this.up1;
                }
                return (this.nBT * uht) / ubt;
            }
            return 0;
        },
        usht: function () {
            if (this.u1 && this.u2 && this.couplage_primaire && this.couplage_secondaire) {
                if (this.u1 < this.u2) {
                    ubt = this.up1;
                    uht = this.up2;
                } else {
                    ubt = this.up2;
                    uht = this.up1;
                }
                return uht / this.nHT;
            }
            return 0;
        },
        usbt: function () {
            if (this.u1 && this.u2 && this.couplage_primaire && this.couplage_secondaire) {
                if (this.u1 < this.u2) {
                    ubt = this.up1;
                    uht = this.up2;
                } else {
                    ubt = this.up2;
                    uht = this.up1;
                }
                return ubt / this.nBT;
            }
            return 0;
        },
        st: function () {
            if (this.puisance_apparente) {
                return this.puisance_apparente / 3;
            }
            return 0;
        },
        Lpmoy: function () {
            if (this.st) {
                return 0.5 + 0.6 * Math.pow(this.st, 1 / 4);
            }
            return 0;
        },
        uccr: function () {
            if (this.st && this.Lpmoy && this.usht) {
                return (
                    ((0.79 * this.f * this.st) / this.usht) *
                    2.25 *
                    0.9 *
                    this.Lpmoy *
                    0.01
                );
            }
            return 0;
        },
        D: function () {
            if (this.st && this.Lpmoy && this.uccr) {
                return (
                    16 *
                    Math.pow(
                        (this.st * 0.9 * this.Lpmoy) /
                        (this.uccr * this.f * 3 * 0.951 * 0.951),
                        1 / 4
                    )
                );
            }
            return 0;
        },
        H: function () {
            if (this.D) {
                return (Math.PI * this.D) / 2.25;
            }
            return 0;
        },
        Lf: function () {
            if (this.d1 && this.d2) {
                return 2 * ((this.d1 + this.d2) * 0.01 + 0.5) + 0.5;
            }
            return 0;
        },
        Lc: function () {
            if (this.Lf) {
                return 2 * this.Lf + 3 * this.D;
            }
            return 0;
        }
    },
    watch: {
        puisance_apparente: function (value) {}
    },
    mounted: function () {}
});