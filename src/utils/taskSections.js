/**
 * Group tasks into Today / Tomorrow / This week / etc. for section lists.
 */

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export function getDueDate(task) {
  if (!task?.dueDate) return null;
  return task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
}

/**
 * Days from local "today" to task due (0 = today, 1 = tomorrow).
 */
function dayOffsetFromToday(due) {
  const t0 = startOfDay(new Date());
  const t1 = startOfDay(due);
  return Math.round((t1 - t0) / 86400000);
}

const SECTION_ORDER = [
  'overdue',
  'today',
  'tomorrow',
  'week',
  'later',
  'nodate',
];

const SECTION_TITLES = {
  overdue: 'Overdue',
  today: 'Today',
  tomorrow: 'Tomorrow',
  week: 'This week',
  later: 'Later',
  nodate: 'No date',
};

/**
 * @param {Array} tasks — already filtered & sorted by due date ascending
 * @returns {{ title: string, data: object[] }[]}
 */
export function buildTaskSections(tasks) {
  const buckets = {
    overdue: [],
    today: [],
    tomorrow: [],
    week: [],
    later: [],
    nodate: [],
  };

  for (const task of tasks) {
    const due = getDueDate(task);
    if (!due) {
      buckets.nodate.push(task);
      continue;
    }

    const offset = dayOffsetFromToday(due);
    if (offset < 0) {
      buckets.overdue.push(task);
    } else if (offset === 0) {
      buckets.today.push(task);
    } else if (offset === 1) {
      buckets.tomorrow.push(task);
    } else if (offset >= 2 && offset <= 7) {
      buckets.week.push(task);
    } else {
      buckets.later.push(task);
    }
  }

  const sections = [];
  for (const key of SECTION_ORDER) {
    const data = buckets[key];
    if (data.length > 0) {
      sections.push({ title: SECTION_TITLES[key], data });
    }
  }
  return sections;
}
