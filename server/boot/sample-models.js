// module.exports = function(app) {
//   var Adventurer = app.models.Adventurer;
//   var Role = app.models.Role;
//   var RoleMapping = app.models.RoleMapping;
//   var Party = app.models.Party;

//   Adventurer.create([
//     {username: 'John', email: 'john@doe.com', password: '1234'},
//     {username: 'Jane', email: 'jane@doe.com', password: '1234'},
//     {username: 'Bob', email: 'bob@projects.com', password: '1234'},
//   ], function(err, adventurers) {
//     if (err) throw err;

//     console.log('Created adventurers:', adventurers);

//     // create project 1 and make john the owner
//     adventurers[0].campaigns.create({
//       title: 'cmp1',
//     }, function(err, campaign) {
//       if (err) throw err;

//       console.log('Created campaign:', campaign);

//       // add team members
//       Party.create([
//         {ownerId: campaign.ownerId, memberId: adventurers[0].id},
//         {ownerId: campaign.ownerId, memberId: adventurers[1].id},
//       ], function(err, party) {
//         if (err) throw err;

//         console.log('Created party:', party);
//       });
//     });

//     // create project 2 and make jane the owner
//     adventurers[1].campaigns.create({
//       title: 'cmp2',
//     }, function(err, campaign) {
//       if (err) throw err;

//       console.log('Created campaign:', campaign);

//       // add team members
//       Party.create({
//         ownerId: campaign.ownerId,
//         memberId: adventurers[1].id,
//       }, function(err, party) {
//         if (err) throw err;

//         console.log('Created party:', party);
//       });
//     });

//     // create the admin role
//     Role.create({
//       name: 'admin',
//     }, function(err, role) {
//       if (err) throw err;

//       console.log('Created role:', role);

//       // make bob an admin
//       role.principals.create({
//         principalType: RoleMapping.USER,
//         principalId: adventurers[2].id,
//       }, function(err, principal) {
//         if (err) throw err;

//         console.log('Created principal:', principal);
//       });
//     });
//   });
// };
