const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

async function getLessonsList({ userId, moduleId }) {
  const moduleData = await getDBRequest("getModuleInfo", {
    query: { code: moduleId },
    returns: ["lessons"],
  });

  const lessonList = [];

  for (const lesson of Object.entries(moduleData?.lessons || {})) {
    const [lessonId, lessonData] = lesson;
    const lessonStateData = await getDBRequest("getUserState", {
      query: {
        userId,
        taskId: { $regex: `^${moduleId}${lessonId}` },
      },
    });
    var inProcess = false;
    const progress =
      lessonStateData.length === 0
        ? 0
        : Math.trunc(
            (lessonStateData.reduce((progress, value) => {
              if (value.inProcess && !inProcess) inProcess = true;
              return progress + (value.score || 0);
            }, 0) /
              lessonData?.maxScore) *
              100
          );

    lessonList.push({
      id: lessonId,
      title: lessonData.title,
      description: lessonData.description,
      maxScore: lessonData.maxScore,
      inProcess,
      progress,
    });
  }

  if (lessonList.length > 0) {
    let currentLesson = 0;
    lessonList.forEach((lesson, index) => {
      if (lesson.inProcess) {
        currentLesson = index;
      }
    });
    lessonList[currentLesson].currentLesson = true;
  }

  return {
    OK: true,
    data: lessonList,
  };
}

module.exports.getLessonsList = getLessonsList;
