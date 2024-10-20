import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

async function getDb() {
  if (!db) {
    db = await open({
      filename: './analytics.db',
      driver: sqlite3.Database
    });
    await initDb();
  }
  return db;
}

export async function initDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS analytics_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT,
      age TEXT,
      gender TEXT,
      feature_a INTEGER,
      feature_b INTEGER,
      feature_c INTEGER,
      feature_d INTEGER,
      feature_e INTEGER,
      feature_f INTEGER
    );
  `);

  // Insert sample data if the table is empty
  const count = await db.get('SELECT COUNT(*) as count FROM analytics_data');
  if (count.count === 0) {
    const sampleData = [
  { Day: '4/10/2022', Age: '15-25', Gender: 'Male', A: 166, B: 247, C: 255, D: 325, E: 133, F: 727 },
  { Day: '4/10/2022', Age: '>25', Gender: 'Male', A: 350, B: 819, C: 942, D: 788, E: 427, F: 813 },
  { Day: '4/10/2022', Age: '15-25', Gender: 'Female', A: 390, B: 170, C: 379, D: 780, E: 405, F: 264 },
  { Day: '4/10/2022', Age: '>25', Gender: 'Female', A: 913, B: 495, C: 379, D: 417, E: 124, F: 868 },
  { Day: '5/10/2022', Age: '15-25', Gender: 'Male', A: 157, B: 789, C: 991, D: 308, E: 970, F: 401 },
  { Day: '5/10/2022', Age: '>25', Gender: 'Male', A: 591, B: 996, C: 429, D: 734, E: 355, F: 461 },
  { Day: '5/10/2022', Age: '15-25', Gender: 'Female', A: 222, B: 204, C: 494, D: 84, E: 492, F: 563 },
  { Day: '5/10/2022', Age: '>25', Gender: 'Female', A: 269, B: 904, C: 778, D: 428, E: 822, F: 507 },
  { Day: '6/10/2022', Age: '15-25', Gender: 'Male', A: 827, B: 494, C: 141, D: 729, E: 201, F: 689 },
  { Day: '6/10/2022', Age: '>25', Gender: 'Male', A: 199, B: 232, C: 676, D: 796, E: 24, F: 275 },
  { Day: '6/10/2022', Age: '15-25', Gender: 'Female', A: 399, B: 904, C: 810, D: 164, E: 952, F: 479 },
  { Day: '6/10/2022', Age: '>25', Gender: 'Female', A: 71, B: 956, C: 96, D: 431, E: 466, F: 488 },
  { Day: '7/10/2022', Age: '15-25', Gender: 'Male', A: 933, B: 91, C: 252, D: 617, E: 736, F: 658 },
  { Day: '7/10/2022', Age: '>25', Gender: 'Male', A: 359, B: 614, C: 940, D: 926, E: 876, F: 812 },
  { Day: '7/10/2022', Age: '15-25', Gender: 'Female', A: 773, B: 926, C: 21, D: 52, E: 59, F: 401 },
  { Day: '7/10/2022', Age: '>25', Gender: 'Female', A: 136, B: 343, C: 303, D: 853, E: 646, F: 574 },
  { Day: '8/10/2022', Age: '15-25', Gender: 'Male', A: 273, B: 640, C: 147, D: 16, E: 90, F: 469 },
  { Day: '8/10/2022', Age: '>25', Gender: 'Male', A: 962, B: 166, C: 658, D: 665, E: 757, F: 561 },
  { Day: '8/10/2022', Age: '15-25', Gender: 'Female', A: 762, B: 677, C: 132, D: 479, E: 700, F: 616 },
  { Day: '8/10/2022', Age: '>25', Gender: 'Female', A: 853, B: 406, C: 760, D: 581, E: 800, F: 393 },
  { Day: '9/10/2022', Age: '15-25', Gender: 'Male', A: 46, B: 17, C: 478, D: 774, E: 346, F: 692 },
  { Day: '9/10/2022', Age: '>25', Gender: 'Male', A: 446, B: 574, C: 869, D: 150, E: 970, F: 594 },
  { Day: '9/10/2022', Age: '15-25', Gender: 'Female', A: 10, B: 835, C: 594, D: 791, E: 73, F: 219 },
  { Day: '9/10/2022', Age: '>25', Gender: 'Female', A: 520, B: 296, C: 995, D: 344, E: 887, F: 306 },
  { Day: '10/10/2022', Age: '15-25', Gender: 'Male', A: 333, B: 786, C: 473, D: 177, E: 714, F: 311 },
  { Day: '10/10/2022', Age: '>25', Gender: 'Male', A: 129, B: 3, C: 455, D: 45, E: 969, F: 398 },
  { Day: '10/10/2022', Age: '15-25', Gender: 'Female', A: 415, B: 506, C: 258, D: 973, E: 208, F: 173 },
  { Day: '10/10/2022', Age: '>25', Gender: 'Female', A: 88, B: 383, C: 507, D: 91, E: 452, F: 712 },
  { Day: '11/10/2022', Age: '15-25', Gender: 'Male', A: 36, B: 819, C: 961, D: 855, E: 12, F: 285 },
  { Day: '11/10/2022', Age: '>25', Gender: 'Male', A: 648, B: 786, C: 748, D: 292, E: 572, F: 450 },
  { Day: '11/10/2022', Age: '15-25', Gender: 'Female', A: 91, B: 938, C: 988, D: 217, E: 942, F: 9 },
  { Day: '11/10/2022', Age: '>25', Gender: 'Female', A: 371, B: 665, C: 654, D: 311, E: 564, F: 456 },
  { Day: '12/10/2022', Age: '15-25', Gender: 'Male', A: 1, B: 517, C: 229, D: 809, E: 962, F: 147 },
  { Day: '12/10/2022', Age: '>25', Gender: 'Male', A: 60, B: 193, C: 0, D: 156, E: 754, F: 738 },
  { Day: '12/10/2022', Age: '15-25', Gender: 'Female', A: 686, B: 538, C: 724, D: 492, E: 49, F: 756 },
  { Day: '12/10/2022', Age: '>25', Gender: 'Female', A: 358, B: 13, C: 273, D: 448, E: 846, F: 274 },
  { Day: '13/10/2022', Age: '15-25', Gender: 'Male', A: 535, B: 9, C: 904, D: 248, E: 963, F: 18 },
  { Day: '13/10/2022', Age: '>25', Gender: 'Male', A: 492, B: 439, C: 779, D: 91, E: 646, F: 648 },
  { Day: '13/10/2022', Age: '15-25', Gender: 'Female', A: 849, B: 528, C: 393, D: 170, E: 971, F: 469 },
  { Day: '13/10/2022', Age: '>25', Gender: 'Female', A: 620, B: 37, C: 267, D: 634, E: 511, F: 471 },
  { Day: '14/10/2022', Age: '15-25', Gender: 'Male', A: 200, B: 457, C: 840, D: 652, E: 940, F: 328 },
  { Day: '14/10/2022', Age: '>25', Gender: 'Male', A: 940, B: 342, C: 127, D: 360, E: 397, F: 146 },
  { Day: '14/10/2022', Age: '15-25', Gender: 'Female', A: 866, B: 705, C: 290, D: 140, E: 891, F: 188 },
  { Day: '14/10/2022', Age: '>25', Gender: 'Female', A: 156, B: 255, C: 765, D: 987, E: 860, F: 118 },
  { Day: '15/10/2022', Age: '15-25', Gender: 'Male', A: 628, B: 488, C: 974, D: 582, E: 912, F: 712 },
  { Day: '15/10/2022', Age: '>25', Gender: 'Male', A: 9, B: 809, C: 650, D: 174, E: 883, F: 157 },
  { Day: '15/10/2022', Age: '15-25', Gender: 'Female', A: 183, B: 648, C: 457, D: 759, E: 23, F: 189 },
  { Day: '15/10/2022', Age: '>25', Gender: 'Female', A: 220, B: 20, C: 892, D: 629, E: 169, F: 147 },
  { Day: '16/10/2022', Age: '15-25', Gender: 'Male', A: 17, B: 806, C: 163, D: 880, E: 194, F: 855 },
  { Day: '16/10/2022', Age: '>25', Gender: 'Male', A: 901, B: 361, C: 346, D: 384, E: 128, F: 416 },
  { Day: '16/10/2022', Age: '15-25', Gender: 'Female', A: 19, B: 189, C: 172, D: 623, E: 587, F: 210 },
  { Day: '16/10/2022', Age: '>25', Gender: 'Female', A: 820, B: 377, C: 372, D: 397, E: 310, F: 599 },
  { Day: '17/10/2022', Age: '15-25', Gender: 'Male', A: 174, B: 246, C: 335, D: 243, E: 493, F: 453 },
  { Day: '17/10/2022', Age: '>25', Gender: 'Male', A: 914, B: 526, C: 89, D: 351, E: 450, F: 811 },
  { Day: '17/10/2022', Age: '15-25', Gender: 'Female', A: 327, B: 137, C: 839, D: 431, E: 317, F: 684 },
  { Day: '17/10/2022', Age: '>25', Gender: 'Female', A: 602, B: 573, C: 385, D: 937, E: 669, F: 176 },
  { Day: '18/10/2022', Age: '15-25', Gender: 'Male', A: 206, B: 883, C: 654, D: 638, E: 722, F: 134 },
  { Day: '18/10/2022', Age: '>25', Gender: 'Male', A: 120, B: 758, C: 153, D: 737, E: 978, F: 448 },
  { Day: '18/10/2022', Age: '15-25', Gender: 'Female', A: 136, B: 32, C: 473, D: 136, E: 366, F: 81 },
  { Day: '18/10/2022', Age: '>25', Gender: 'Female', A: 805, B: 514, C: 151, D: 507, E: 194, F: 992 },
  { Day: '19/10/2022', Age: '15-25', Gender: 'Male', A: 472, B: 315, C: 36, D: 643, E: 79, F: 889 },
  { Day: '19/10/2022', Age: '>25', Gender: 'Male', A: 616, B: 958, C: 72, D: 355, E: 222, F: 225 },
  { Day: '19/10/2022', Age: '15-25', Gender: 'Female', A: 700, B: 199, C: 485, D: 183, E: 76, F: 215 },
  { Day: '19/10/2022', Age: '>25', Gender: 'Female', A: 754, B: 812, C: 711, D: 356, E: 447, F: 60 },
  { Day: '20/10/2022', Age: '15-25', Gender: 'Male', A: 941, B: 943, C: 19, D: 629, E: 745, F: 518 },
  { Day: '20/10/2022', Age: '>25', Gender: 'Male', A: 926, B: 347, C: 428, D: 127, E: 790, F: 695 },
  { Day: '20/10/2022', Age: '15-25', Gender: 'Female', A: 926, B: 467, C: 665, D: 850, E: 436, F: 671 },
  { Day: '20/10/2022', Age: '>25', Gender: 'Female', A: 204, B: 418, C: 210, D: 968, E: 552, F: 662 },
  { Day: '21/10/2022', Age: '15-25', Gender: 'Male', A: 940, B: 833, C: 913, D: 614, E: 604, F: 653 },
  { Day: '21/10/2022', Age: '>25', Gender: 'Male', A: 754, B: 635, C: 861, D: 448, E: 157, F: 412 },
  { Day: '21/10/2022', Age: '15-25', Gender: 'Female', A: 299, B: 710, C: 86, D: 656, E: 992, F: 614 },
  { Day: '21/10/2022', Age: '>25', Gender: 'Female', A: 437, B: 56, C: 828, D: 839, E: 879, F: 151 },
  { Day: '22/10/2022', Age: '15-25', Gender: 'Male', A: 129, B: 795, C: 205, D: 741, E: 558, F: 158 },
  { Day: '22/10/2022', Age: '>25', Gender: 'Male', A: 222, B: 942, C: 722, D: 927, E: 700, F: 731 },
  { Day: '22/10/2022', Age: '15-25', Gender: 'Female', A: 863, B: 811, C: 192, D: 330, E: 600, F: 876 },
  { Day: '22/10/2022', Age: '>25', Gender: 'Female', A: 598, B: 784, C: 145, D: 684, E: 50, F: 211 },
  { Day: '23/10/2022', Age: '15-25', Gender: 'Male', A: 677, B: 397, C: 383, D: 597, E: 303, F: 87 },
  { Day: '23/10/2022', Age: '>25', Gender: 'Male', A: 158, B: 912, C: 302, D: 574, E: 758, F: 255 },
  { Day: '23/10/2022', Age: '15-25', Gender: 'Female', A: 857, B: 712, C: 409, D: 42, E: 701, F: 563 },
  { Day: '23/10/2022', Age: '>25', Gender: 'Female', A: 267, B: 76, C: 378, D: 144, E: 662, F: 787 },
  { Day: '24/10/2022', Age: '15-25', Gender: 'Male', A: 775, B: 974, C: 680, D: 4, E: 952, F: 943 },
  { Day: '24/10/2022', Age: '>25', Gender: 'Male', A: 795, B: 827, C: 488, D: 987, E: 624, F: 739 },
  { Day: '24/10/2022', Age: '15-25', Gender: 'Female', A: 306, B: 995, C: 528, D: 502, E: 712, F: 448 },
  { Day: '24/10/2022', Age: '>25', Gender: 'Female', A: 596, B: 735, C: 368, D: 126, E: 665, F: 168 },
  { Day: '25/10/2022', Age: '15-25', Gender: 'Male', A: 77, B: 76, C: 800, D: 493, E: 504, F: 646 },
  { Day: '25/10/2022', Age: '>25', Gender: 'Male', A: 432, B: 262, C: 60, D: 971, E: 781, F: 267 },
  { Day: '25/10/2022', Age: '15-25', Gender: 'Female', A: 185, B: 813, C: 474, D: 34, E: 739, F: 40 },
  { Day: '25/10/2022', Age: '>25', Gender: 'Female', A: 638, B: 794, C: 682, D: 892, E: 949, F: 765 },
  { Day: '26/10/2022', Age: '15-25', Gender: 'Male', A: 171, B: 507, C: 311, D: 387, E: 968, F: 527 },
  { Day: '26/10/2022', Age: '>25', Gender: 'Male', A: 269, B: 59, C: 544, D: 353, E: 548, F: 967 },
  { Day: '26/10/2022', Age: '15-25', Gender: 'Female', A: 768, B: 67, C: 274, D: 940, E: 51, F: 545 },
  { Day: '26/10/2022', Age: '>25', Gender: 'Female', A: 717, B: 356, C: 440, D: 871, E: 70, F: 121 },
  { Day: '27/10/2022', Age: '15-25', Gender: 'Male', A: 861, B: 736, C: 237, D: 343, E: 870, F: 621 },
  { Day: '27/10/2022', Age: '>25', Gender: 'Male', A: 568, B: 912, C: 709, D: 440, E: 632, F: 325 },
  { Day: '27/10/2022', Age: '15-25', Gender: 'Female', A: 456, B: 440, C: 779, D: 258, E: 669, F: 889 },
  { Day: '27/10/2022', Age: '>25', Gender: 'Female', A: 747, B: 922, C: 760, D: 993, E: 454, F: 657 },
  { Day: '28/10/2022', Age: '15-25', Gender: 'Male', A: 952, B: 526, C: 357, D: 199, E: 33, F: 736 },
  { Day: '28/10/2022', Age: '>25', Gender: 'Male', A: 809, B: 904, C: 336, D: 686, E: 688, F: 460 },
  { Day: '28/10/2022', Age: '15-25', Gender: 'Female', A: 668, B: 250, C: 123, D: 615, E: 953, F: 614 },
  { Day: '28/10/2022', Age: '>25', Gender: 'Female', A: 431, B: 379, C: 792, D: 984, E: 597, F: 391 },
  { Day: '29/10/2022', Age: '15-25', Gender: 'Male', A: 195, B: 571, C: 866, D: 217, E: 728, F: 101 },
  { Day: '29/10/2022', Age: '>25', Gender: 'Male', A: 283, B: 707, C: 856, D: 677, E: 115, F: 285 },
  { Day: '29/10/2022', Age: '15-25', Gender: 'Female', A: 334, B: 156, C: 30, D: 900, E: 352, F: 714 },
  { Day: '29/10/2022', Age: '>25', Gender: 'Female', A: 194, B: 279, C: 393, D: 709, E: 40, F: 682 }
];

    const stmt = await db.prepare(`
      INSERT INTO analytics_data (day, age, gender, feature_a, feature_b, feature_c, feature_d, feature_e, feature_f)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const row of sampleData) {
      await stmt.run(row.Day, row.Age, row.Gender, row.A, row.B, row.C, row.D, row.E, row.F);
    }

    await stmt.finalize();
  }
}

const INIT_SECRET = 'moonshot_q2_naman';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' || req.headers['x-init-secret'] !== INIT_SECRET) {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    await initDb();
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ message: 'Failed to initialize database' });
  }
}